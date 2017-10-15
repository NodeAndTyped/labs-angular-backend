process.env.NODE_ENV = "test";

import {expect} from "chai";

import * as SuperTest from "supertest";
import {ExpressApplication} from "ts-express-decorators";
import {bootstrap, Done, inject} from "ts-express-decorators/testing";
import {Server} from "../src/index";


describe("Rest :", () => {


    it("should do nothing", () => {

        expect(true).to.be.true;

    });

    beforeEach(bootstrap(Server));

    describe("POST /api/users/authenticate", () => {

        it("should respond 400", inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

            SuperTest(expressApplication)
                .post("/api/users/authenticate")
                .send({
                    password: "test"
                })
                .expect(400)
                .end(done as any);


        }));

        it("should respond 400", inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

            SuperTest(expressApplication)
                .post("/api/users/authenticate")
                .send({})
                .expect(400)
                .end(done as any);


        }));

        it("should respond 404", inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

            SuperTest(expressApplication)
                .post("/api/users/authenticate")
                .send({
                    email: "t@t.fr",
                    password: "test"
                })
                .expect(404)
                .end(done as any);


        }));


        it("should respond 404", inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

            SuperTest(expressApplication)
                .post("/api/users/authenticate")
                .send({
                    email: "johnniebenson@cytrex.com",
                    password: "test"
                })
                .expect(404)
                .end(done as any);


        }));

        it("should respond 200", inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

            SuperTest(expressApplication)
                .post("/api/users/authenticate")
                .send({
                    email: "johnniebenson@cytrex.com",
                    password: "12345"
                })
                .expect(200)
                .end((err, response) => {

                    if (err) {
                        throw(err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj._id).to.be.equals("58ebddf642dc90b2031faa36");
                    expect(obj.firstName).to.be.equals("Johnnie");
                    expect(obj.email).to.be.equals("johnniebenson@cytrex.com");
                    expect(obj.password).to.be.equals("12345");
                    expect(obj.status).to.be.equals("online");

                    done();

                });

        }));

    });

    describe("GET /api/users", () => {

        it("should respond 200", inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

            SuperTest(expressApplication)
                .get("/api/users")
                .expect(200)
                .end((err, response) => {

                    if (err) {
                        throw(err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("array");
                    expect(obj[0].password).to.be.undefined;
                    done();

                });

        }));

    });

    describe("GET /api/users/:id", () => {

        it("should respond 200 (by id)", inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

            SuperTest(expressApplication)
                .get("/api/users/58ebddf642dc90b2031faa36")
                .expect(200)
                .end((err, response) => {

                    if (err) {
                        throw(err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj._id).to.be.equals("58ebddf642dc90b2031faa36");
                    expect(obj.firstName).to.be.equals("Johnnie");
                    expect(obj.email).to.be.equals("johnniebenson@cytrex.com");
                    expect(obj.password).to.be.equals("12345");
                    expect(obj.status).to.be.equals("online");
                    done();

                });

        }));

        it("should respond 200 (by mail)", inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

            SuperTest(expressApplication)
                .get("/api/users/johnniebenson@cytrex.com")
                .expect(200)
                .end((err, response) => {

                    if (err) {
                        throw(err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj._id).to.be.equals("58ebddf642dc90b2031faa36");
                    expect(obj.firstName).to.be.equals("Johnnie");
                    expect(obj.email).to.be.equals("johnniebenson@cytrex.com");
                    expect(obj.password).to.be.equals("12345");
                    expect(obj.status).to.be.equals("online");
                    done();

                });

        }));

        describe("POST /api/users", () => {

            let id;

            it("should respond 201", inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

                SuperTest(expressApplication)
                    .post("/api/users")
                    .send({
                        user: {
                            email: "test@test.fr",
                            password: "12345",
                            firstName: "Johnie",
                            lastName: "Johns"
                        }
                    })
                    .expect(201)
                    .end((err, response) => {

                        if (err) {
                            throw(err);
                        }

                        let obj = JSON.parse(response.text);

                        expect(obj).to.be.an("object");
                        expect(obj._id).to.be.a("string");
                        expect(obj.firstName).to.be.equals("Johnie");
                        expect(obj.email).to.be.equals("test@test.fr");
                        expect(obj.password).to.be.equals("12345");

                        id = obj._id;

                        done();

                    });
            }));

            it("should get the previous created user", inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

                SuperTest(expressApplication)
                    .get("/api/users/" + id)
                    .expect(200)
                    .end((err, response) => {

                        if (err) {
                            throw(err);
                        }

                        let obj = JSON.parse(response.text);

                        expect(obj).to.be.an("object");
                        expect(obj._id).to.be.equals(id);
                        expect(obj.firstName).to.be.equals("Johnie");
                        expect(obj.email).to.be.equals("test@test.fr");
                        expect(obj.password).to.be.equals("12345");

                        done();

                    });

            }));

            it("should respond 400 (user exists)", inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

                SuperTest(expressApplication)
                    .post("/api/users")
                    .send({
                        user: {
                            email: "test@test.fr",
                            password: "12345",
                            firstName: "Johnie",
                            lastName: "Johns"
                        }
                    })
                    .expect(400)
                    .end(done as any);
            }));

        });

        describe("PATH /api/users/:email/:status", () => {


            it("should respond 200", inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

                SuperTest(expressApplication)
                    .patch("/api/users/test@test.fr/offline")
                    .expect(200)
                    .end((err, response) => {

                        if (err) {
                            throw(err);
                        }

                        let obj = JSON.parse(response.text);

                        expect(obj).to.be.an("object");
                        expect(obj.firstName).to.be.equals("Johnie");
                        expect(obj.email).to.be.equals("test@test.fr");
                        expect(obj.password).to.be.equals("12345");
                        expect(obj.status).to.be.equals("offline");

                        done();

                    });

            }));

        });

        describe("PUT /api/users/:id", () => {

            it("should respond 200", inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

                SuperTest(expressApplication)
                    .put("/api/users/58ebddf642dc90b2031faa36")
                    .send({
                        user: {
                            firstName: "test",
                            lastName: "test",
                            email: "email@domain.fr"
                        }
                    })
                    .expect(200)
                    .end((err, response) => {

                        if (err) {
                            throw(err);
                        }

                        let obj = JSON.parse(response.text);

                        expect(obj).to.be.an("object");
                        expect(obj.firstName).to.be.equals("test");

                        done();

                    });

            }));

        });
    });

});