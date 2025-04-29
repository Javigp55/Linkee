from django.contrib import admin
from .models import  TemporaryLink,Links, refresh_token, Country, Visits, OperativeSystem, Referer

# Register your models here.
admin.site.register(TemporaryLink)
admin.site.register(Links)
admin.site.register(refresh_token)
admin.site.register(Country)
admin.site.register(Visits)
admin.site.register(OperativeSystem)
admin.site.register(Referer)
# admin.site.register(User)