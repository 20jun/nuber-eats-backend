import { InputType, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entitiy";
import { CoreOutput } from "./output.dto";


@ObjectType()
export class EditProfileOutput extends CoreOutput {}

@InputType()
export class EditProfileInput extends PartialType(
    PickType(User, ['email', 'password']),
    ) {}