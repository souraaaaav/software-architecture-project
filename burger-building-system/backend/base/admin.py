from django.contrib import admin

from .models import Burger, Order, User

# Register your models here.
admin.site.register(User)
admin.site.register(Burger)
admin.site.register(Order)
