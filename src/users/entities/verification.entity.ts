import {v4 as uuidv4} from 'uuid';
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entitiy";



@InputType({isAbstract : true})
@ObjectType()
@Entity()
// CoreEntity 덕분에 이미 id, createdAt, updatedAt을 가지고 있음
export class Verification extends CoreEntity {

    @Column()
    @Field(type => String)
    code : string;


    // Verification으로부터 User에 접근하려면 Verification에서 작성
    @OneToOne(type => User, {onDelete : 'CASCADE'})
    @JoinColumn()
    user : User;

    @BeforeInsert()
    createCode() : void {
        this.code = uuidv4();
    }
}