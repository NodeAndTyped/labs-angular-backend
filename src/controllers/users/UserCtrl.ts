import {
    BodyParams,
    Controller,
    Delete,
    Get,
    Patch,
    PathParams,
    Post,
    Put,
    Required,
    Status
} from "ts-express-decorators";
import {Description, Example, Returns, ReturnsArray, Summary} from "ts-express-decorators/lib/swagger";
import {BadRequest, NotFound} from "ts-httpexceptions";
import {$log} from "ts-log-debug";
import {CredentialPayload} from "../../models/CredentialPayload";
import {IUser, User} from "../../models/User";
import {UsersService} from "../../services/UsersService";


@Controller("/users")
export class UserCtrl {

    constructor(private usersService: UsersService) {

    }

    /**
     * Authenticate a user.
     * @returns {IUser}
     * @param credential
     */
    @Post("/authenticate")
    @Summary("Connexion utilisateur")
    @Description("Service de connexion à l'application")
    @Returns(404, {
        description: "Authentication failed, user not found"
    })
    public authenticate(@Required()
                        @Description("Email et mot de passe de l'utilisateur")
                        @BodyParams() credential: CredentialPayload) {

        const {email, password} = credential;

        $log.debug("authenticate user with email", email, " & password ", password);

        const user: IUser = this.usersService.findByEmail(email);

        $log.debug("find user by email", user);

        if (!user) {
            throw new NotFound("Authentication failed, user not found");
        }

        if (user.password !== password) {
            throw new NotFound("Authentication failed, user not found");
        }

        return this.usersService.update(user._id, {status: "online"});
    }

    /**
     * Find a user by is mail or id.
     * @param idOrMail
     * @returns {IUser}
     */
    @Get("/:id")
    @Summary("Retourne un compte utilisateur")
    @Description("Recherche un utilisateur à partir de son identifiant de compte ou à partir de son adresse e-mail")
    @Returns(404, {
        description: "User not found"
    })
    @Returns(User)
    public get(@Description("Id du compte utilisateur ou adresse e-mail")
               @Example("id or email@domain.fr")
               @PathParams("id") idOrMail: string): IUser {

        const user = this.usersService.findByEmail(idOrMail) || this.usersService.find(idOrMail);

        if (!user) {
            throw new NotFound("User not found.");
        }

        return user;
    }

    @Patch("/:email/:status")
    @Summary("Change le status de l'utilisateur")
    @Returns(404, {
        description: "User not found"
    })
    @Returns(400, {
        description: "Wrong status or Wrong email"
    })
    @Returns(User)
    public updateStatus(@Example("email@domain.fr")
                        @Required() @PathParams("email") email: string,
                        @Description("Status du compte \"offline\", \"busy\", \"online\"")
                        @Example("busy")
                        @Required() @PathParams("status") status: string): IUser {

        if (!this.usersService.checkStatus(status)) {
            throw new BadRequest("Wrong status");
        }

        if (!this.usersService.checkEmail(email)) {
            throw new BadRequest("Wrong email");
        }

        const user = this.usersService.findByEmail(email);

        if (!user) {
            throw new NotFound("User not found.");
        }

        $log.debug("patch from email", email, "with status", status);

        return this.usersService.update(user._id, {status});
    }

    /**
     *
     * @param id
     * @param user
     * @returns {IUser}
     */
    @Put("/:id")
    @Summary("Mise à jour des informations du compte utilisateur")
    @Returns(404, {
        description: "User not found"
    })
    @Returns(User)
    public update(@Example("58ebddf642dc90b2031faa36")
                  @PathParams("id") id: string,
                  @Required() @BodyParams("user") user: User): IUser {
        const oldUser = this.usersService.find(id);

        if (!oldUser) {
            throw new NotFound("User not found.");
        }

        return this.usersService.update(oldUser._id, user);
    }

    /**
     *
     * @param user
     * @returns {IUser}
     */
    @Post("/")
    @Status(201)
    @Summary("Création d\'un compte utilisateur")
    @Returns(400, {
        description: "Email are required or Password are required or User already created with this email."
    })
    @Returns(User)
    public create(@Required() @BodyParams("user") user: User): IUser {

        $log.debug("rest create user", user);

        if (!user.email || !this.usersService.checkEmail(user.email)) {
            throw new BadRequest("Email are required");
        }

        if (!user.password) {
            throw new BadRequest("Password are required");
        }

        if (this.usersService.findByEmail(user.email)) {
            throw new BadRequest("User already created with this email.");
        }

        return this.usersService.create(user);
    }

    /**
     * Remove the user.
     * @param id
     * @returns {any}
     */
    @Delete("/:id")
    @Summary("Suppression du compte utilisateur")
    @Description("Suppression d'un compte utilisateur à partir de son identifiant de compte")
    @Returns(404, {
        description: "Not found"
    })
    @Returns(User)
    public remove(@Description("Identifiant du compte utilisateur")
                  @Example("58ebddf642dc90b2031faa36")
                  @PathParams("id") id: string) {
        const user = this.usersService.find(id);

        if (!user) {
            throw new NotFound("User not found.");
        }

        this.usersService.remove(id);

        return user;
    }

    /**
     * Get All users.
     * @returns {IUser[]}
     */
    @Get("/")
    @Summary("Retourne la liste des comptes utilisateurs")
    @ReturnsArray(User)
    public getList(): IUser[] {

        return this.usersService.query().map(o => {

            o = Object.assign({}, o);
            delete o.password;

            return o;
        });
    }
}