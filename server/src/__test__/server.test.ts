import request from "supertest";
import server from "../server";
import {connectionDB} from "../server"
import db from "../config/db";
import { error, log } from "console";
jest.mock('../config/db');

describe('conect to database',()=>{
  it('should handle database conection error', async () =>{
    jest.spyOn(db,'authenticate')
    .mockRejectedValueOnce(new Error("Hubo un error al conectar"))

    const consoleSpy = jest.spyOn(console,'log')
    await connectionDB()

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Hubo un error al conectar")
    )

  })
})
