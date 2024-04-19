# Generated by Django 4.2.11 on 2024-04-16 18:35

import django.core.validators
import multiselectfield.db.fields
from django.db import migrations
from django.db import models


class Migration(migrations.Migration):

    dependencies = [
        ("documents", "1046_workflowaction_remove_all_correspondents_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="savedview",
            name="display_mode",
            field=models.CharField(
                blank=True,
                choices=[
                    ("table", "Table"),
                    ("smallCards", "Small Cards"),
                    ("largeCards", "Large Cards"),
                ],
                max_length=128,
                null=True,
                verbose_name="View display mode",
            ),
        ),
        migrations.AddField(
            model_name="savedview",
            name="page_size",
            field=models.PositiveIntegerField(
                blank=True,
                null=True,
                validators=[django.core.validators.MinValueValidator(1)],
                verbose_name="View page size",
            ),
        ),
        migrations.AddField(
            model_name="savedview",
            name="display_fields",
            field=multiselectfield.db.fields.MultiSelectField(
                blank=True,
                choices=[
                    ("title", "Title"),
                    ("created", "Created"),
                    ("added", "Added"),
                    ("tag", "Tags"),
                    ("documenttype", "Document Type"),
                    ("correspondent", "Correspondent"),
                    ("storagepath", "Storage Path"),
                ],
                max_length=128,
                null=True,
                verbose_name="Document display fields",
            ),
        ),
    ]
