import bcrypt from "bcrypt";

const users = [];

export const signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { username, password: hashedPassword };
    users.push(newUser);

    console.log(users);

    res.status(201).json({
      users,
      message: "Account registered successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const unhashedPassword = await bcrypt.compare(password, user.password);

    if (!unhashedPassword) {
      return res
        .status(400)
        .json({ message: "Incorrect password", success: true });
    }

    console.log(`User ${user.username} signed in`);

    res.status(200).json({
      message: "Logged in successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
