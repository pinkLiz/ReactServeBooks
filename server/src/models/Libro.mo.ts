import { Table, Column, Model, DataType, Default, PrimaryKey, AutoIncrement, Unique, AllowNull } from "sequelize-typescript";

@Table({
    tableName: 'libros'
})

class Libro extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    declare id: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })
    declare titulo: string;

    @Unique
    @AllowNull(false)
    @Column({
        type: DataType.STRING(30)
    })
    declare isbn: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })
    declare autor: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    }) 
    declare editorial: string;

    @Column({
        type: DataType.TEXT
    })
    declare sinopsis: string;

    @Default('otro')
    @Column({
        type: DataType.ENUM('novela', 'romance','cienciaFiccion', 'terror','infantil','fantasia','otro')
    })
    declare genero: string;

    @Column({
        type: DataType.INTEGER,
        validate: {
            is: /^[0-9]{4}$/
        }
    })
    declare anioPublicacion: number;

    @Default(true)
    @Column({
        type: DataType.BOOLEAN()
    })
    declare disponible: boolean
}

export default Libro