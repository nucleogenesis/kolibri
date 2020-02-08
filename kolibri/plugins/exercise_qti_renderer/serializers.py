from rest_framework import serializers

class QtiAssessmentSerializer(serializers.Serializer):
    xml = serializers.CharField()
