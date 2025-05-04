from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import CustomUser
from rest_framework.permissions import AllowAny

from .permissions import IsAdmin, IsDeveloper, IsNormalUser

#génère un token d'authentification JWT (refresh + access) pour un utilisateur donné
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

#Authentifie l'utilisateur
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            tokens = get_tokens_for_user(user)

            # Détermination de la redirection
            if user.is_admin:
                redirect_url = "/admin"
            elif user.is_developer:
                redirect_url = "/developer"
            else:
                redirect_url = "/user"

            return Response({
                "user": UserSerializer(user).data,
                "tokens": tokens,
                "redirect": redirect_url
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#Crée un nouvel utilisateur
class RegisterView(APIView):
    permission_classes = [AllowAny]  
    #CREATE
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

#Renvoie les infos de l’utilisateur connecté.
#Accessible seulement si l'utilisateur est authentifié grâce à IsAuthenticated.
class UserProfile(APIView):
    permission_classes = [IsAuthenticated, IsNormalUser]
    #READ
    def get(self, request):
        return Response({
            "username": request.user.username,
            "is_admin": request.user.is_admin
        })
    

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_object(self, pk):
        try:
            return CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return None
    #UPDATE
    def put(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        user = self.get_object(pk)
        if not user:
            return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #DELETE
    def delete(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        user = self.get_object(pk)
        if not user:
            return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
                
    

# VUE POUR DEVELOPER
class DeveloperDashboard(APIView):
    permission_classes = [IsAuthenticated, IsDeveloper]

    def get(self, request):
        return Response({"message": "Bienvenue sur le tableau de bord développeur."})


# VUE POUR USER NORMAL
class UserDashboard(APIView):
    permission_classes = [IsAuthenticated, IsNormalUser]

    def get(self, request):
        return Response({"message": "Bienvenue sur votre espace utilisateur."})

class TestAdminView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        return Response({"message": "Vous êtes bien admin."})
