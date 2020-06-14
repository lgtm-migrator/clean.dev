import { Auth, CognitoUser } from '@aws-amplify/auth';

Auth.configure({
  region: process.env.AWS_REGION,
  userPoolId: process.env.COGNITO_POOL_ID,
  userPoolWebClientId: process.env.COGNITO_CLIENT_ID,
  mandatorySignIn: false,
});

type UserChallanges = 'NEW_PASSWORD_REQUIRED'

export interface AuthenticatedUser extends CognitoUser {
  challengeName?: UserChallanges,
  attributes?: {
    email: string;
  }
}

export interface CleanUser {
  username: string;
}

export async function signIn(username: string, password: string): Promise<AuthenticatedUser|null> {
  try {
    return Auth.signIn({
      username,
      password,
    });
  } catch (error) {
    return null;
  }
}

export async function getUser(): Promise<AuthenticatedUser|null> {
  try {
    return await Auth.currentAuthenticatedUser();
  } catch (error) {
    return null;
  }
}

export async function signOut(): Promise<void> {
  Auth.signOut();
}

export function getCleanUser(cognitoUser: AuthenticatedUser): CleanUser {
  return {
    username: cognitoUser.attributes?.email ?? '',
  };
}

export async function changePassword(
  username: string,
  oldPassword: string,
  newPassword: string,
): Promise<boolean> {
  try {
    const oldUser = await signIn(username, oldPassword);
    if (oldUser?.challengeName === 'NEW_PASSWORD_REQUIRED') {
      await Auth.completeNewPassword(oldUser, newPassword, {});
      return true;
    }
    await Auth.changePassword(oldUser, oldPassword, newPassword);
    return true;
  } catch (error) {
    return false;
  }
}
