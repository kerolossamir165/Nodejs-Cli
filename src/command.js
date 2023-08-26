import yargs from "yargs";
import { hideBin } from "yargs/helpers";

yargs(hideBin(process.argv))
  .command(
    "new <content>",
    "Get the content and create new note",
    (yargs) => {
      return yargs.positional("Give me", {
        type: "string",
        description: "The content and will create new note",
      });
    },
    async (argv) => {}
  )
  .option("tags", {
    alias: "t",
    type: "string",
    description: "tags to add to the note",
  })
  .command(
    "all",
    "Get all notes ",
    () => {},
    async (argv) => {}
  )
  .command(
    "find <filter>",
    "get matching notes",
    (yargs) => {
      return yargs.positional("filter", {
        describe:
          "The search term to filter notes by, will be applied to note.content",
        type: "string",
      });
    },
    async (argv) => {}
  )
  .command(
    "remove <id>",
    "remove a note by id",
    (yargs) => {
      return yargs.positional("id", {
        type: "number",
        description: "The id of the note you want to remove",
      });
    },
    async (argv) => {}
  )
  .command(
    "clean",
    "remove all notes",
    () => {},
    async (argv) => {}
  )
  .demandCommand(1)
  .parse();
