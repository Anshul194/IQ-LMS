import catchAsync from '../utils/catchAsync.js';

const validateRequest = (schema) => {
    return catchAsync(async (req, res, next) => {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    });
};

export default validateRequest;
