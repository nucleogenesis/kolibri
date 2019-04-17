# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-04-16 17:11
from __future__ import unicode_literals

from django.db import migrations
from django.db import models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0017_slideshowmetadata'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contentnode',
            name='kind',
            field=models.CharField(blank=True, choices=[('topic', 'Topic'), ('video', 'Video'), ('audio', 'Audio'), ('exercise', 'Exercise'), ('document', 'Document'), ('html5', 'HTML5 App'), ('slideshow', 'Slideshow')], max_length=200),
        ),
        migrations.AlterField(
            model_name='file',
            name='preset',
            field=models.CharField(blank=True, choices=[('high_res_video', 'High Resolution'), ('low_res_video', 'Low Resolution'), ('video_thumbnail', 'Thumbnail'), ('video_subtitle', 'Subtitle'), ('video_dependency', 'Video (dependency)'), ('audio', 'Audio'), ('audio_thumbnail', 'Thumbnail'), ('document', 'Document'), ('epub', 'ePub Document'), ('document_thumbnail', 'Thumbnail'), ('exercise', 'Exercise'), ('exercise_thumbnail', 'Thumbnail'), ('exercise_image', 'Exercise Image'), ('exercise_graphie', 'Exercise Graphie'), ('channel_thumbnail', 'Channel Thumbnail'), ('topic_thumbnail', 'Thumbnail'), ('html5_zip', 'HTML5 Zip'), ('html5_dependency', 'HTML5 Dependency (Zip format)'), ('html5_thumbnail', 'HTML5 Thumbnail'), ('slide_image', 'Slide Image')], max_length=150),
        ),
    ]
