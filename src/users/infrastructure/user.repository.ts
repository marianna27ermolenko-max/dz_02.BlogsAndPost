import { ObjectId, WithId } from "mongodb";
import { userCollection } from "../../db/mongo.db";
import { UserAccountDbType } from "../../auth/types/user.account.db.type";
import { UserUpdateEmailResending } from "../types/updateUserByEmailResending";

export const usersRepository = {
  async createUserAdmin(newUser: UserAccountDbType): Promise<string> {
    const createUser = await userCollection.insertOne(newUser);
    return createUser.insertedId.toString();
  },

  async createUser(newUser: UserAccountDbType): Promise<string> {
    const createUser = await userCollection.insertOne(newUser);
    return createUser.insertedId.toString();
  },

  async deleteUser(id: string): Promise<boolean> {
    const deleteUser = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteUser.deletedCount === 1;
  },

  async findById(id: string): Promise<WithId<UserAccountDbType> | null> {
    return await userCollection.findOne({ _id: new ObjectId(id) });
  },

  async findByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<WithId<UserAccountDbType> | null> {
    console.log(loginOrEmail);

    return await userCollection.findOne({
      $or: [
        { "accountData.login": loginOrEmail },
        { "accountData.email": loginOrEmail },
      ],
    });
  },

  async findByLogin(login: string): Promise<WithId<UserAccountDbType> | null> {
    return await userCollection.findOne({ "accountData.login": login });
  },

  async findByEmail(email: string): Promise<WithId<UserAccountDbType> | null> {
    const result = await userCollection.findOne({ "accountData.email": email });
    return result;
  },

  async doesExistByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<boolean> {
    const user = await userCollection.findOne({
      $or: [{ "accountData.email": email }, { "accountData.login": login }]
    });
    console.log(user);
    
    return !!user;
  },

  async findUserByConfirmationCode(
    code: string,
  ): Promise<UserAccountDbType | null> {
    const user = await userCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    if (!user) return null;
    return user;
  },

  async updateIsConfirmed(email: string): Promise<boolean> {
    const updateConfirm = await userCollection.updateOne(
      { "accountData.email": email },
      { $set: { "emailConfirmation.isConfirmed": true } },
    );
    return updateConfirm.matchedCount > 0;
  },

    async updateUserByEmailResending(email: string, dto: UserUpdateEmailResending): Promise<boolean> {
    const { confirmationCode, expirationDate } = dto;
 
    const updateResult = await userCollection.updateOne(
      { "accountData.email": email },
      { $set: { "emailConfirmation.confirmationCode": confirmationCode, "emailConfirmation.expirationDate": expirationDate }}, 
    );
    return updateResult.matchedCount > 0;
  },
};
