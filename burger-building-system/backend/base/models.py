from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):

    def create_user(self, email, password):
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.is_staff = True
        user.is_active = True
        user.is_superuser = False
        user.save()
        return user

    def create_superuser(self, email, password):
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.isVerified = True
        user.save()
        return user


class User(AbstractUser):
    username = None
    first_name = None
    last_name = None
    email = models.EmailField(_('email address'), unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()
    fullname = models.CharField(null=True, max_length=50)
    isVerified = models.BooleanField(default=False)
    otp = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.email


class Burger(models.Model):
    salad = models.IntegerField(null=True, blank=True)
    meat = models.IntegerField(null=True, blank=True)
    bacon = models.IntegerField(null=True, blank=True)
    cheese = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return str(self.id)


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    burger = models.OneToOneField(Burger, on_delete=models.CASCADE)
    total_price = models.IntegerField(null=True, blank=True)
    order_id = models.CharField(max_length=20)
    order_time = models.DateTimeField(auto_now_add=True)
    deliver_time = models.DateTimeField(auto_now=True)
    delivered = models.BooleanField(default=False)

    def __str__(self):
        return str(self.id)
