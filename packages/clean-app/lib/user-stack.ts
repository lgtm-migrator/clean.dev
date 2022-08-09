import { CfnOutput, Stack } from "aws-cdk-lib";
import { OAuthScope, UserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class UserStack extends Stack {
  constructor (scope: Construct, id: string) {
    super(scope, id);

    const userPool = new UserPool(this, 'UserPool', {
      userPoolName: 'CleanUserPool',
      selfSignUpEnabled: false,
      signInAliases: {
        username: false,
        email: true,
      },
    });

    const client = userPool.addClient('web', {
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [OAuthScope.OPENID],
        callbackUrls: ['https://clean.dev'],
      },
    });

    new CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      exportName: 'UserPoolId',
    });

    new CfnOutput(this, 'UserPoolClientId', {
      value: client.userPoolClientId,
      exportName: 'UserPoolClientId',
    });
  }
}
