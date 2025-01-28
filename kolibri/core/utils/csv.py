import io
import re
from contextlib import contextmanager
from numbers import Number

from django.core.files.storage import default_storage


@contextmanager
def open_csv_for_writing(filename):
    if default_storage.exists(filename):
        # If the file exists, we need to open it and return it wrapped in a TextIOWrapper
        with default_storage.open(filename, "rb+") as f:
            encoded_fh = io.TextIOWrapper(
                f, newline="", encoding="utf-8-sig", write_through=True
            )
            yield encoded_fh
            encoded_fh.flush()
            default_storage.save(filename, f)
    else:
        # If the file does not exist, we need to create it and return it wrapped in a TextIOWrapper
        with io.BytesIO() as f:
            encoded_fh = io.TextIOWrapper(
                f,
                newline="",
                encoding="utf-8-sig",
                write_through=True,
                line_buffering=True,
            )
            yield encoded_fh
            encoded_fh.flush()
            default_storage.save(filename, f)


@contextmanager
def open_csv_for_reading(filename):
    with default_storage.open(filename, "r") as f:
        yield f


negative_number_regex = re.compile("^-?[0-9,\\.]+$")
csv_injection_chars = {"@", "+", "-", "=", "|", "%"}


def sanitize(value):
    if value is None or isinstance(value, Number):
        return value

    value = str(value)
    if (
        value
        and value[0] in csv_injection_chars
        and not negative_number_regex.match(value)
    ):
        value = value.replace("|", "\\|")
        value = "'" + value
    return value


def output_mapper(obj, labels=None, output_mappings=None, exclude_fields=None):
    if exclude_fields is None:
        exclude_fields = set()
    mapped_obj = {}
    labels = labels or {}
    output_mappings = output_mappings or {}
    for header, label in labels.items():
        if header in output_mappings:
            mapped_obj[label] = sanitize(output_mappings[header](obj))
        elif header in obj:
            mapped_obj[label] = sanitize(obj[header])
    return mapped_obj
