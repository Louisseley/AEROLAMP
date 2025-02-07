from django.contrib.auth import get_user_model

User = get_user_model()

class EmailAuthBackend:
    def authenticate(self, request, email=None, password=None):
        try:
            # Retrieve user by email
            user = User.objects.get(email=email)
            # Check if password matches
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            # Return None if user does not exist
            return None

    def get_user(self, user_id):
        try:
            # Retrieve user by primary key (ID)
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            # Return None if user does not exist
            return None
