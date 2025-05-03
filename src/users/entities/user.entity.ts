// user.model.ts
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Campus } from 'src/settings/entities/campus.entity';
import { Department } from 'src/settings/entities/department.entity';
import { School } from 'src/settings/entities/school.entity';

// Define the UserRole type
export type UserRole =
    | 'student'
    | 'staff'
    | 'dean_of_school'
    | 'hod'
    | 'director_of_languages'
    | 'librarian'
    | 'finance'
    | 'dean_of_student_welfare'
    | 'admin';

// Create an enum for the roles
export enum StaffRole {
    STUDENT = 'student',
    STAFF = 'staff',
    DEAN_OF_SCHOOL = 'dean_of_school',
    HOD = 'hod',
    DIRECTOR_OF_LANGUAGES = 'director_of_languages',
    LIBRARIAN = 'librarian',
    FINANCE = 'finance',
    DEAN_OF_STUDENT_WELFARE = 'dean_of_student_welfare'
}

@Table({ tableName: 'users' })
export class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;

    @Column({
        type: DataType.STRING(50),
        unique: true,
        allowNull: true
    })
    regNumber: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })
    firstName: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })
    lastName: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })
    email: string;
 
    @Column({
        type: DataType.STRING(255),
        allowNull: true
    })
    password: string;

    @Column({
        type:
            DataType.ENUM(
                'student',
                'staff',
                'dean_of_school',
                'hod',
                'director_of_languages',
                'librarian',
                'finance',
                'dean_of_student_welfare',
                'admin'
            )
        ,
        allowNull: true
    })
    roles: 'student' |
        'staff' |
        'dean_of_school' |
        'hod' |
        'director_of_languages' |
        'librarian' |
        'finance' |
        'dean_of_student_welfare' |
        'admin';

    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })
    staffPosition: string;

    @ForeignKey(() => Campus)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    campusId: number;

    @ForeignKey(() => School)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    schoolId: number;

    @ForeignKey(() => Department)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    departmentId: number;

    @Column({
        type: DataType.STRING(20),
        allowNull: true
    })
    phoneNumber: string;
    @BelongsTo(() => Campus)
    campus: Campus
    @BelongsTo(() => School)
    school: School
    @BelongsTo(() => Department)
    department: Department
}