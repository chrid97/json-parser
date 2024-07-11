type AstNode =
    | { type: "Object", value: { [key: string]: AstNode } }
    | { type: "Array", value: AstNode[] }
    | { type: "String", value: string }
    | { type: "Boolean", value: boolean }
    | { type: "Number", value: number }
    | { type: "Null", value: null }

type TokenType =
    | "L_BRACE"
    | "R_BRACE"
    | "L_BRACKET"
    | "R_BRACKET"
    | "STRING"
    | "NUMBER" | "COMMA"
    | "COLON"
    | "TRUE"
    | "FALSE"
    | "NULL";

type Token = {
    token_type: TokenType;
    literal: string;
};

let INPUT = `{
  "id": "647ceaf3657eade56f8224eb",
  "index": 0,
  "something": [],
  "boolean": true,
  "nullValue": null
}`;

function main(): void {
    if (INPUT === "") {
        console.error("Invalid JSON\n");
    }

    const tokens = lexer(INPUT);
    console.log(tokens);
}

function parser(tokens: Token[]) {
    let current = 0;

    function advance(): Token {
        return tokens[++current];
    }

    function parse(token: Token): AstNode {
        switch (token.token_type) {
            case "L_BRACE":
            case "L_BRACKET":
            case "STRING":
                return { type: "String", value: token.literal };
            case "NUMBER":
                return { type: "Number", value: Number(token.literal) };
            case "TRUE":
                return { type: "Boolean", value: true };
            case "FALSE":
                return { type: "Boolean", value: false };
            case "NULL":
                return { type: "Null", value: null };
            default:
                throw new Error(`Unexpected token type: ${token.literal}`);
        }
    }

    function parse_object(): AstNode {
        
    }
}

function lexer(input: string): Token[] {
    const tokens: Token[] = [];
    let current_position = 0;

    while (current_position < input.length) {
        switch (input[current_position]) {
            case "{": {
                tokens.push({ token_type: "L_BRACE", literal: "{" });
                break;
            };
            case "}": {
                tokens.push({ token_type: "L_BRACE", literal: "}" });
                break;
            };
            case "[": {
                tokens.push({ token_type: "L_BRACKET", literal: "[" });
                break;
            };
            case "]": {
                tokens.push({ token_type: "R_BRACKET", literal: "]" });
                break;
            };
            case ":": {
                tokens.push({ token_type: "COLON", literal: ":" });
                break;
            };
            case ",": {
                tokens.push({ token_type: "COMMA", literal: "," });
                break;
            };
            case "\"": {
                let literal = "";
                current_position++;
                while (input[current_position] != "\"") {
                    literal = literal.concat(input[current_position]);
                    current_position++;
                };
                const token: Token = { token_type: "STRING", literal };
                tokens.push(token);
                break;
            };

            default:
                let literal = "";
                while (/[\d\w]/.test(input[current_position])) {
                    literal = literal.concat(input[current_position]);
                    current_position++;
                };

                // skip whitespace, I don't think i need this but whatever
                if (/\s/.test(input[current_position])) {
                    break;
                }

                if (is_number(literal)) {
                    tokens.push({ token_type: "NUMBER", literal });
                }
                if (is_null(literal)) {
                    tokens.push({ token_type: "NULL", literal });
                }
                if (is_boolean_true(literal)) {
                    tokens.push({ token_type: "TRUE", literal });
                }
                if (is_boolean_false(literal)) {
                    tokens.push({ token_type: "FALSE", literal });
                }
                break;
        }

        current_position++;
    }

    return tokens;
}

type Check = (value: string) => boolean;
const is_number: Check = (value) => {
    if (typeof value != "string") {
        return false;
    }

    return !isNaN(parseFloat(value));
};
const is_null: Check = (value) => value === "null";
const is_boolean_true: Check = (value) => value === "true";
const is_boolean_false: Check = (value) => value === "false";

main();
