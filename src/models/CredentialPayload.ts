import {JsonProperty, Required} from "ts-express-decorators";
import {Example} from "ts-express-decorators/lib/swagger";

export class CredentialPayload {
    @JsonProperty()
    @Required()
    @Example("email@domain.fr")
    email: string = "";

    @JsonProperty()
    @Required()
    @Example("mot de passe secret")
    password: string = "";
}