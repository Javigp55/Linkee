from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta
from django.utils.timezone import now
from django.conf import settings
from django.core.exceptions import ValidationError






# Create your models here.


##MODELO LINKS
class Links(models.Model):
    slug = models.CharField(max_length=20, unique=True , null=True, blank=True )
    name = models.CharField(max_length=20, unique=True )
    url = models.CharField(max_length=5000)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    count = models.IntegerField(default=0)
    qr = models.CharField(max_length=5000, blank=True)
    
    def __str__(self):
        return self.name




###MODELO TEMPORAL
class TemporaryLink(models.Model):
    name = models.TextField(max_length=8, blank=True)
    url = models.TextField(max_length=5000)
    created_at = models.DateTimeField(auto_now_add=True)
    expired_at = models.DateTimeField(null=True)
    qr = models.CharField(max_length=5000)
    def __str__(self):
        return self.url
    def save(self, *args, **kwargs):
        if not self.expired_at:
            self.expired_at = (now() + timedelta(minutes=10)).replace(tzinfo=None)
            print(self.expired_at)
            super().save()


##########MODEL AUTH TOKEN
class refresh_token(models.Model):
    token = models.CharField(max_length=2000, unique=True)
    access = models.CharField(unique=True)
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.token
    

######MODEL COUNTRY
class Country(models.Model):
    link = models.ForeignKey(Links, on_delete=models.CASCADE)
    country = models.CharField(max_length=30)
    date = models.DateField(auto_now_add=True)
    count = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.link.name} - {self.date}"
    
######MODEL VISIT
class Visits(models.Model):
    link = models.ForeignKey(Links, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    count = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.link.name} - {self.date}"
    
class OperativeSystem(models.Model):
    link = models.ForeignKey(Links, on_delete=models.CASCADE)
    os = models.CharField(max_length=30)
    date = models.DateField(auto_now_add=True)
    count = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.link.name} - {self.date}"
    
class Referer(models.Model):
    link = models.ForeignKey(Links, on_delete=models.CASCADE)
    referer = models.CharField(max_length=300)
    date = models.DateField(auto_now_add=True)
    count = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.link.name} - {self.date}"