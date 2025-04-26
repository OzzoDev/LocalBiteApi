export const getReview = async (req, res, next) => {
  const { reviewid: reviewId } = req.params;

  try {
    //
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  const { dishid: dishId } = req.params;

  try {
    //
  } catch (err) {
    next(err);
  }
};

export const getRatingStats = async (req, res, next) => {
  const { dishid: dishId } = req.params;

  try {
    //
  } catch (err) {
    next(err);
  }
};

export const review = async (req, res, next) => {
  const { id: userId } = req.user;

  try {
    //
  } catch (err) {
    next(err);
  }
};

export const editReview = async (req, res, next) => {
  const { reviewid: reviewId } = req.params;
  const { id: userId } = req.user;

  try {
    //
  } catch (err) {
    next(err);
  }
};

export const removeReview = async (req, res, next) => {
  const { reviewid: reviewId } = req.params;
  const { id: userId } = req.user;

  try {
    //
  } catch (err) {
    next(err);
  }
};
