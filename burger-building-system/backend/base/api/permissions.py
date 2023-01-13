from rest_framework.permissions import BasePermission


class isVerifiedUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.isVerified)
