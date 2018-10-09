from __future__ import absolute_import
from __future__ import division

import os
import sys
import time

from kolibri.core.analytics.pskolibri.common import LINUX
from kolibri.core.analytics.pskolibri.common import memoize_when_activated
from kolibri.core.analytics.pskolibri.common import NoSuchProcess
from kolibri.core.analytics.pskolibri.common import POSIX
from kolibri.core.analytics.pskolibri.common import PY3
from kolibri.core.analytics.pskolibri.common import WINDOWS
# This module is heavily based on the psutil module
#
# https://github.com/giampaolo/psutil
# Copyright (c) 2009, Jay Loden, Dave Daeschler, Giampaolo Rodola under BSD License
#
# Most of these functions are stripped versions of psutil
# simplified/adapted integrated with Kolibri.
#
# Linux part follows psutil in most of the code
# Windows adds some new ideas and has replaced the C code
# by Python code wrapped over ctypes


_TOTAL_PHYMEM = None
_timer = getattr(time, 'monotonic', time.time)

if LINUX:
    # This is public API and it will be retrieved from _pslinux.py
    # via sys.modules.
    PROCFS_PATH = "/proc"

    from kolibri.core.analytics.pskolibri import _pslinux as _psplatform

elif WINDOWS:
    from kolibri.core.analytics.pskolibri import _pswindows as _psplatform

else:  # pragma: no cover
    raise NotImplementedError('platform %s is not supported' % sys.platform)

# elif MACOS:
#     from kolibri.core.analytics.pskolibri import _psosx as _psplatform


def _cpu_times_deltas(t1, t2):
    assert t1._fields == t2._fields, (t1, t2)
    field_deltas = []
    for field in _psplatform.scputimes._fields:
        field_delta = getattr(t2, field) - getattr(t1, field)
        field_delta = max(0, field_delta)
        field_deltas.append(field_delta)
    return _psplatform.scputimes(*field_deltas)


def _cpu_tot_time(times):
    """Given a cpu_time() ntuple calculates the total CPU time
    (including idle time).
    """
    tot = sum(times)
    if LINUX:
        tot -= getattr(times, "guest", 0)  # Linux 2.6.24+
        tot -= getattr(times, "guest_nice", 0)  # Linux 3.2.0+
    return tot


def _cpu_busy_time(times):
    """Given a cpu_time() ntuple calculates the busy CPU time.
    We do so by subtracting all idle CPU times.
    """
    busy = _cpu_tot_time(times)
    busy -= times.idle
    busy -= getattr(times, "iowait", 0)
    return busy


def cpu_times():
    """Return system-wide CPU times as a namedtuple.
    Every CPU time represents the seconds the CPU has spent in the
    given mode. The namedtuple's fields availability varies depending on the
    platform:

     - user
     - system
     - idle
     - nice (UNIX)
     - iowait (Linux)
     - irq (Linux, FreeBSD)
     - softirq (Linux)
     - steal (Linux >= 2.6.11)
     - guest (Linux >= 2.6.24)
     - guest_nice (Linux >= 3.2.0)
    """
    return _psplatform.cpu_times()


try:
    _last_cpu_times = cpu_times()
except Exception:
    # Don't want to crash at import time.
    _last_cpu_times = None

try:
    _last_per_cpu_times = cpu_times(percpu=True)
except Exception:
    # Don't want to crash at import time.
    _last_per_cpu_times = None


def cpu_count():
    """Return the number of logical CPUs in the system (same as
    os.cpu_count() in Python 3.4).
    Return None if undetermined.
    The return value is cached after first call.
    If desired cache can be cleared like this:

    >>> psutil.cpu_count.cache_clear()
    """

    ret = _psplatform.cpu_count_logical()
    if ret is not None and ret < 1:
        ret = None
    return ret


def cpu_percent():
    """Return a float representing the current system-wide CPU
    utilization as a percentage.
    """
    global _last_cpu_times
    global _last_per_cpu_times

    def calculate(t1, t2):
        times_delta = _cpu_times_deltas(t1, t2)

        all_delta = _cpu_tot_time(times_delta)
        busy_delta = _cpu_busy_time(times_delta)

        try:
            busy_perc = (busy_delta / all_delta) * 100
        except ZeroDivisionError:
            return 0.0
        else:
            return round(busy_perc, 1)

    t1 = _last_cpu_times
    if t1 is None:
        # Something bad happened at import time. We'll
        # get a meaningful result on the next call. See:
        # https://github.com/giampaolo/psutil/pull/715
        t1 = cpu_times()
    _last_cpu_times = cpu_times()
    return calculate(t1, _last_cpu_times)


def virtual_memory():
    """Return statistics about system memory usage as a namedtuple
    including the following fields, expressed in bytes:

     - total:
       total physical memory available.

     - used:
        memory used, calculated differently depending on the platform and
        designed for informational purposes only:
        macOS: active + inactive + wired
        BSD: active + wired + cached
        Linux: total - free

    The sum of 'used' and 'available' does not necessarily equal total.
    On Windows 'available' and 'free' are the same.
    """
    global _TOTAL_PHYMEM
    ret = _psplatform.virtual_memory()
    # cached for later use in Process.memory_percent()
    _TOTAL_PHYMEM = ret.total
    return ret


def pids():
    """Return a list of current running PIDs."""
    return _psplatform.pids()


def pid_exists(pid):
    """Return True if given PID exists in the current process list.
    This is faster than doing "pid in psutil.pids()" and
    should be preferred.
    """
    if pid < 0:
        return False
    elif pid == 0 and POSIX:
        # On POSIX we use os.kill() to determine PID existence.
        # According to "man 2 kill" PID 0 has a special meaning
        # though: it refers to <<every process in the process
        # group of the calling process>> and that is not we want
        # to do here.
        return pid in pids()
    else:
        return _psplatform.pid_exists(pid)


class Process(object):
    """Represents an OS process with the given PID.
    If PID is omitted current process PID (os.getpid()) is used.
    Raise NoSuchProcess if PID does not exist.
    """

    def __init__(self, pid=None):
        self._init(pid)

    def _init(self, pid, _ignore_nsp=False):
        if pid is None:
            pid = os.getpid()
        else:
            if not PY3 and not isinstance(pid, (int, long)):
                raise TypeError('pid must be an integer (got %r)' % pid)
            if pid < 0:
                raise ValueError('pid must be a positive integer (got %s)' % pid)
        self._pid = pid
        self._create_time = None
        # used for caching on Windows only (on POSIX ppid may change)
        self._ppid = None
        # platform-specific modules define an _psplatform.Process
        # implementation class
        self._proc = _psplatform.Process(pid)
        self._last_sys_cpu_times = None
        self._last_proc_cpu_times = None
        # cache creation time for later use in is_running() method
        try:
            self.create_time()
        except NoSuchProcess:
            if not _ignore_nsp:
                raise NoSuchProcess()
            else:
                self._gone = True
        # This pair is supposed to indentify a Process instance
        # univocally over time (the PID alone is not enough as
        # it might refer to a process whose PID has been reused).
        # This will be used later in __eq__() and is_running().
        self._ident = (self.pid, self._create_time)

    @property
    def pid(self):
        """The process PID."""
        return self._pid

    def cmdline(self):
        """The command line this process has been called with."""
        return self._proc.cmdline()

    def create_time(self):
        """The process creation time as a floating point number
        expressed in seconds since the epoch, in UTC.
        The return value is cached after first call.
        """
        if self._create_time is None:
            self._create_time = self._proc.create_time()
        return self._create_time

    @memoize_when_activated
    def memory_info(self):
        """Return a namedtuple with variable fields depending on the
        platform, representing memory information about the process.

        The "portable" fields available on all plaforms are `rss` and `vms`.

        All numbers are expressed in bytes.
        """
        return self._proc.memory_info()

    def cpu_percent(self):
        """Return a float representing the current process CPU
        utilization as a percentage.
        The returned value is explicitly NOT split evenly between
        all available logical CPUs. This means that a busy loop process
        running on a system with 2 logical CPUs will be reported as
        having 100% CPU utilization instead of 50%.
        """
        num_cpus = cpu_count() or 1

        def timer():
            return _timer() * num_cpus

        st1 = self._last_sys_cpu_times
        pt1 = self._last_proc_cpu_times
        st2 = timer()
        pt2 = self._proc.cpu_times()
        if st1 is None or pt1 is None:
            self._last_sys_cpu_times = st2
            self._last_proc_cpu_times = pt2
            return 0.0

        delta_proc = (pt2.user - pt1.user) + (pt2.system - pt1.system)
        delta_time = st2 - st1
        # reset values for next call in case of interval == None
        self._last_sys_cpu_times = st2
        self._last_proc_cpu_times = pt2

        try:
            # This is the utilization split evenly between all CPUs.
            # E.g. a busy loop process on a 2-CPU-cores system at this
            # point is reported as 50% instead of 100%.
            overall_cpus_percent = (delta_proc / delta_time) * 100
        except ZeroDivisionError:
            # interval was too low
            return 0.0
        else:
            single_cpu_percent = overall_cpus_percent * num_cpus
            return round(single_cpu_percent, 1)
