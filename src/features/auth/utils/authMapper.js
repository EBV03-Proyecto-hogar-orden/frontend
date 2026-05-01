/**
 * Mappers to decouple backend data structures from frontend domain models.
 */

export const mapUserFromToken = (decodedToken) => {
  if (!decodedToken) return null;

  return {
    id: decodedToken.user_id || decodedToken.sub || decodedToken.id,
    email: decodedToken.email,
    username: decodedToken.username || decodedToken.name,
    roles: decodedToken.roles || [],
  };
};

export const mapAuthResponse = (data) => {
  return {
    accessToken: data.access,
    refreshToken: data.refresh,
    user: data.user ? {
      id: data.user.id,
      email: data.user.email,
      username: data.user.username,
    } : null,
  };
};
