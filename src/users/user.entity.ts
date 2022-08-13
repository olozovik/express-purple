import { compare, hash } from 'bcryptjs';

export class User {
    private _password: string;

    constructor(private readonly _email: string, private readonly _name?: string) {}

    get email(): string {
        return this._email;
    }

    get name(): string | undefined {
        return this._name;
    }

    get password(): string {
        return this._password;
    }

    public async setPassword(pass: string, salt: number): Promise<void> {
        this._password = await hash(pass, salt);
    }

    public async comparePassword(pass: string, passDB: string): Promise<boolean> {
        return await compare(pass, passDB);
    }
}
