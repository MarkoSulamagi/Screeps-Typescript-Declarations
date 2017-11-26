/// <reference path="./index.d.ts" />

// This file exists solely to test whether or not the typings actually work.
// After working on your changes, make sure to run `npm run compile` to build
// the declarations before opening this file.
//
// If you open this file and see no red squiggly lines, then you're good!
// Feel free to add more test cases in the form of a sample code.

// Some test cases are still missing.

////////
// Sample inputs
const creep: Creep = Game.creeps.sampleCreep;
const room: Room = Game.rooms.W10S10;
const flag: Flag = Game.flags.Flag1;
const body: string[] = [WORK, WORK, CARRY, MOVE];

// Sample inputs for Game.map.findRoute testing
const anotherRoomName: Room = Game.rooms.W10S11;

// Sample memory extensions
interface CreepMemory {
    sourceId: string;
    lastHits: number;
}

////////
// Game.creeps
{
    for (const i in Game.creeps) {
        Game.creeps[i].moveTo(flag);
    }
}

////////
// Game.flags
{
    creep.moveTo(Game.flags.Flag1);
}

////////
// Game.spawns
{
    for (const i in Game.spawns) {
        Game.spawns[i].createCreep(body);
    }
}

////////
// Game.time
{
    console.log(Game.time);
}

////////
// Game.cpu.getUsed()
{
    if (Game.cpu.getUsed() > Game.cpu.tickLimit / 2) {
        console.log("Used half of CPU already!");
    }
}

{
    for (const name in Game.creeps) {
        const startCpu = Game.cpu.getUsed();

        // creep logic goes here
        const elapsed = Game.cpu.getUsed() - startCpu;
        console.log(`Creep ${name} has used ${elapsed} CPU time`);
    }
}

////////
// Game.cpu.setShardLimits()
{
    // Game.cpu.setShardLimits({ shard0: 20, shard1: 10 });
}

////////
// Game.getObjectById(id)
{
    creep.memory.sourceId = creep.pos.findClosestByRange<Source>(FIND_SOURCES).id;
    const source = Game.getObjectById<Source>(creep.memory.sourceId);
}

////////
// Game.notify(message, [groupInterval])
{
    if (creep.hits < creep.memory.lastHits) {
        Game.notify(`Creep ${creep} has been attacked at ${creep.pos}!`);
    }
    creep.memory.lastHits = creep.hits;
}

{
    if (Game.spawns["Spawn1"].energy === 0) {
        Game.notify(
            "Spawn1 is out of energy",
            180  // group these notifications for 3 hours
        );
    }
}

//// Game.map
////////
// Game.map.describeExits()
{
    const exits = Game.map.describeExits("W8N3");
}

////////
// Game.map.findExit()
{
    if (creep.room !== anotherRoomName) {
        const exitDir = Game.map.findExit(creep.room, anotherRoomName);
        const exit = creep.pos.findClosestByRange<RoomPosition>(exitDir);
        creep.moveTo(exit);
    } else {
        // go to some place in another room
    }
}

{
    creep.moveTo(new RoomPosition(25, 25, anotherRoomName.name));
}

////////
// Game.map.findRoute()
{
    const route = Game.map.findRoute(creep.room, anotherRoomName);

    if (route !== ERR_NO_PATH && Array.isArray(route)) {
        console.log(`Now heading to room ${route[0].room}`);
        const exit = creep.pos.findClosestByRange<RoomPosition>(route[0].exit);
        creep.moveTo(exit);
    }
}

{
    const route = Game.map.findRoute(creep.room, anotherRoomName, {
        routeCallback(roomName, fromRoomName) {
            if (roomName === "W10S10") {
                // avoid this room
                return Infinity;
            }
            return 1;
        }
    });
}

{
    const from = new RoomPosition(25, 25, "E1N1");
    const to = new RoomPosition(25, 25, "E4N1");

    // Use `findRoute` to calculate a high-level plan for this path,
    // prioritizing highways and owned rooms
    const allowedRooms = { [from.roomName]: true };
    const route = Game.map.findRoute(from.roomName, to.roomName, {
        routeCallback(roomName) {
            const parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
            const isHighway = (Number.parseInt(parsed[1]) % 10 === 0) ||
                (Number.parseInt(parsed[2]) % 10 === 0);
            const isMyRoom = Game.rooms[roomName] &&
                Game.rooms[roomName].controller &&
                Game.rooms[roomName].controller.my;
            if (isHighway || isMyRoom) {
                return 1;
            } else {
                return 2.5;
            }
        }
    });

    if (route !== ERR_NO_PATH && Array.isArray(route)) {
        route.forEach((info) => {
            allowedRooms[info.room] = true;
        });
    }

    // Invoke PathFinder, allowing access only to rooms from `findRoute`
    const ret = PathFinder.search(from, to, {
        roomCallback(roomName) {
            if (allowedRooms[roomName] === undefined) {
                return false;
            }
        }
    });

    console.log(ret.path);
}

////////
// Game.map.getRoomLinearDistance(roomName1, roomName2, [continuous])
{
    Game.map.getRoomLinearDistance("W1N1", "W4N2"); // 3
    Game.map.getRoomLinearDistance("E65S55", "W65S55", false); // 131
    Game.map.getRoomLinearDistance("E65S55", "W65S55", true); // 11
}

////////
// Game.map.getTerrainAt(x, y, roomName)
// Game.map.getTerrainAt(pos)
{
    console.log(Game.map.getTerrainAt(25, 20, "W10N10"));
}

{
    console.log(Game.map.getTerrainAt(new RoomPosition(25, 20, "W10N10")));
}

////////
// Game.map.isRoomAvailable(roomName)
{
    if (Game.map.isRoomAvailable(room.name)) {
        creep.moveTo(room.getPositionAt(25, 25));
    }
}
