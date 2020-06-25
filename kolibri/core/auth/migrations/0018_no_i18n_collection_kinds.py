# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2020-06-22 15:50
from __future__ import unicode_literals

from django.db import migrations
from django.db import models


class Migration(migrations.Migration):

    dependencies = [
        ("kolibriauth", "0017_remove_facilitydataset_allow_guest_access"),
    ]

    operations = [
        migrations.AlterField(
            model_name="collection",
            name="kind",
            field=models.CharField(
                choices=[
                    ("facility", "Facility"),
                    ("classroom", "Classroom"),
                    ("learnergroup", "Named learner group within a class"),
                    ("adhoclearnersgroup", "Ad hoc learner group within a class"),
                ],
                max_length=20,
            ),
        ),
    ]
