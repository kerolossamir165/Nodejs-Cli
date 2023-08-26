import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  newNote,
  getAllNotes,
  findNotes,
  removeNote,
  removeAllNotes,
} from "./notes.js";
import displayNotes from "./utils/displayNotes.js";
import { start } from "./server.js";

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
    async (argv) => {
      const tags = argv.tags ? argv.tags.split(",") : [];
      const note = await newNote(argv.content, tags);
      console.log("Note Added ", note);
    }
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
    async (argv) => {
      let notes = await getAllNotes(argv);
      displayNotes(notes);
    }
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
    async (argv) => {
      const matches = await findNotes(argv.filter);
      displayNotes(matches);
    }
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
    async (argv) => {
      const id = await removeNote(argv.id);
      if (id) {
        console.log("Note removed: ", id);
      } else {
        console.log("Note not found");
      }
    }
  )
  .command(
    "clean",
    "remove all notes",
    () => {},
    async (argv) => {
      await removeAllNotes();
      console.log("All notes removed");
    }
  )
  .command(
    "web [port]",
    "See All of your notes",
    (yargs) => {
      return yargs.positional("port", {
        type: "number",
        default: 5000,
        description: "The Port to run the web site",
      });
    },
    async (argv) => {
      let notes = await getAllNotes(argv);

      start(notes, argv.port);
    }
  )
  // .command('web [port]', 'launch website to see notes', yargs => {
  //   return yargs
  //     .positional('port', {
  //       describe: 'port to bind on',
  //       default: 5000,
  //       type: 'number'
  //     })
  // }, async (argv) => {
  //   const notes = await getAllNotes()
  //   start(notes, argv.port)
  // })
  .demandCommand(1)
  .parse();
