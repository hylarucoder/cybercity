import * as bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

export const matchPassword = async (password, passwordHashed) => {
  return await bcrypt.compare(password, passwordHashed);
};
