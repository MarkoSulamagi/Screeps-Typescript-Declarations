** This repo has been moved to [typed-screeps](https://github.com/bryanbecker/typed-screeps) **

# Typed-Screeps

> The forked repository for **strong** *Screep's* TypeScript type definitions. https://screeps.com/

# Installation

Using [typings](https://github.com/typings/typings), add this to your typings.json:
```bash
typings install github:resir014/typed-screeps/dist/screeps.d.ts#master -SG
```

# Differences from **[Screeps-Typescript-Declarations](https://github.com/screepers/Screeps-Typescript-Declarations)**:
### Breaking Changes:
- `Memory` is typed by default.  The added typings are:
  - `CreepMemory`
  - `FlagMemory`
  - `SpawnMemory`
  - `RoomMemory`

  If you like the idea of typed memory, but aren't ready to just fully in, just make sure you define an interface for the above four types.  Then you can extend them at a later time.  Example:
  ```TypeScript
  interface CreepMemory { [name: string]: any };
  interface FlagMemory { [name: string]: any };
  interface SpawnMemory { [name: string]: any };
  interface RoomMemory { [name: string]: any };
  ```
  
- Any place in code that uses a constant (ex `STRUCTURE_EXTENSION` or `FIND_MY_SPAWNS` is now constrained to use literal types.  Here is the list of the new types:
  ```
  BodyPartConstant
  StructureConstant
  FindConstant
  LookConstant
  DirectionConstant
  ResourceConstant
  MineralConstant (this is a subset of ResourceConstant)
  ColorConstant
  ScreepsReturnCode
  ```
    
  To update your code, you just need to change any `string` types to match one of the above.  For example, if your code had:
  ```TypeScript
  function getBody(): string[] {
    return [ WORK, MOVE, CARRY ];
  }
  ```
  Change it to:
  ```TypeScript
  function getBody(): BodyPartConstant[] {  // this line changed
    return [ WORK, MOVE, CARRY ];
  }
  ```
- Some original functions were incorrectly typed to not include `null` as a possible return.  You may need to update your code to reflect this update (ex. `findClosestByPath` or `findClosestByRange`)

### Additional (non-breaking) Features:
- `ConstructionSite` can be optionally constrained by a structure type (ex. `ConstructionSite<STRUCTURE_CONTAINER>`). TypeScript will enforce that the `type` property of the `ConstructionSite` appropriately matches
- `Resource` can optionally be constrained (ex. `Resource<RESOURCE_ENERGY>`)
- `Mineral` can optionally be constrained by `MineralConstant` (ex. `Mineral<RESOURCE_GHODIUM>`)
- `Structure` can optionally be constrained (ex `Structure<STRUCTURE_SPAWN | STRUCTURE_EXTENSION>`)
- Screeps classes derived from `Structure` (ex `StructureContainer`) have their `type` property correspondingly constrained
- `LookAt` results are now constrained to the type looked for
- Results from `Find`-type functions are now constrained to have a `RoomPosition`

  


# Usage

Note: When using this API, you can't access creeps in manner suggested in Screeps' tutorial:

```
Game.creeps.Worker1  // This is not allowed by TypeScript compiler
```

Instead, you have to use

```
Game.creeps['Worker1']
```

# Contribute

This library will stay up to date only with the help of you! If active players don't update it, it'll get lost.

To update the declarations, edit the files in ./src folder.

To compile the declarations, run:

```
npm run compile
```

