from django.conf.urls import include
from django.conf.urls import url

from .views import QtiAssessment

urlpatterns = [url(r"(?P<content_id>[0-9a-z]+)", QtiAssessment.as_view(), name='qtiassessment')]
