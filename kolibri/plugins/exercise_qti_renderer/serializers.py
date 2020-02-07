from rest_framework import serializers

class QtiAssessmentSerializer(serializers.Serializer):
    assessmentTest = serializers.CharField()
