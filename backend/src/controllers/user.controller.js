import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const generateTokens = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User with this userid does not exist");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (
    [firstName, lastName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while regestring user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Registred successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "All fields are required");
    }
    const user = await User.findOne({
      $or: [{ email }],
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid User credentials");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    throw error;
  }
});

export { registerUser, loginUser };
