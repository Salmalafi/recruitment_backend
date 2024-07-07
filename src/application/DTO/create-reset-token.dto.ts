
export class CreateResetTokenDto {
    email: string;
  }
  
  export class ResetPasswordDto {
    token: string;
    newPassword: string;
  }
  