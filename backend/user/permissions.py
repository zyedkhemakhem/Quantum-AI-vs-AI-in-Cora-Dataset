from rest_framework import permissions
from rest_framework.permissions import BasePermission


from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        print("is_authenticated:", request.user.is_authenticated)
        print("is_admin:", request.user.is_admin)
        return request.user.is_authenticated and request.user.is_admin



class IsDeveloper(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_developer

class IsNormalUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and not (request.user.is_admin or request.user.is_developer)
