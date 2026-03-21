import { ObjectId, WithId } from "mongodb";
import { userCollection } from "../../db/mongo.db";
import { UserAccountDbType } from "../../auth/types/user.account.db.type";

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

  async findByLoginOrEmail( //удалить?
    loginOrEmail: string,
  ): Promise<WithId<UserAccountDbType> | null> {
    return await userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  },

  async findByLogin(login: string): Promise<WithId<UserAccountDbType> | null> {
  return await userCollection.findOne({ login });
},

 async findByEmail(email: string): Promise<WithId<UserAccountDbType> | null> {
  return await userCollection.findOne({ email });
},

async doesExistByLoginOrEmail(login: string, email: string): Promise<boolean>{

  const user = await userCollection.findOne({ $or: [ { email }, { login } ] });
  return !!user; 
},

async findUserByConfirmationCode(code: string): Promise<UserAccountDbType | null>{

  const user = await userCollection.findOne({'emailConfirmation.confirmationCode': code});
  if(!user) return null;
  return user; 
},

async updateIsConfirmed(email: string): Promise<boolean>{

  const updateConfirm = await userCollection.updateOne({'accountData.email': email}, {$set:{'emailConfirmation.isConfirmed': true}});
  return updateConfirm.matchedCount > 0;
},

};
