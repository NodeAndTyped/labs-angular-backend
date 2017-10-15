import {JsonProperty, Required} from "ts-express-decorators";
import {Description, Example, Schema} from "ts-express-decorators/lib/swagger";

export type PartialUser = Partial<IUser>;

export interface IUser {
    _id: string;
    email: string;
    lastName: string;
    firstName: string;
    password?: string;
    status?: string;
}

export class User implements IUser {
    @JsonProperty()
    @Example("58ebddf642dc90b2031faa36")
    _id: string;

    @JsonProperty()
    @Required()
    @Example("email@domain.fr")
    @Schema({pattern: "/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/"})
    email: string;

    @JsonProperty()
    @Required()
    @Example("John")
    lastName: string;

    @JsonProperty()
    @Required()
    @Example("Doe")
    firstName: string;

    @JsonProperty()
    @Example("mot de passe secret")
    password: string;

    @JsonProperty()
    @Description("Status du compte \"offline\", \"busy\", \"online\"")
    @Schema({enum: ["offline", "busy", "online"]})
    @Example("busy")
    status: string;
}