export const errorHandler = (err, req, res, next) => {

    return res.status(400).json({
        success: false,
        message: err.message || 'Une erreur est survenue'
    });
};