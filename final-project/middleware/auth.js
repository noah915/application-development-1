// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.',
      statusCode: 401
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access required.',
      statusCode: 403
    });
  }
};

// Check if user is the owner or admin (ownership-based access)
const isOwnerOrAdmin = (req, res, next) => {
  const resourceOwnerId = parseInt(req.params.userId);
  const currentUserId = req.session?.userId;
  const isUserAdmin = req.session?.role === 'admin';

  if (currentUserId === resourceOwnerId || isUserAdmin) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Forbidden. You do not have permission to access this resource.',
      statusCode: 403
    });
  }
};

module.exports = { isAuthenticated, isAdmin, isOwnerOrAdmin };
