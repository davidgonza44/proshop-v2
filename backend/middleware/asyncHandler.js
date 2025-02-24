const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next); // usa promesas para evitar try catch blocks
};

export default asyncHandler;
