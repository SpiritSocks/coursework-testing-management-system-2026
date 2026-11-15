using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Stms_backend.Data;

#nullable disable

namespace Stms_backend.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("20261115000000_MakeTestRunCreatorOptional")]
public partial class MakeTestRunCreatorOptional : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey("FK_TestRuns_Users_CreatedById", "TestRuns");
        migrationBuilder.AlterColumn<int>(
            name: "CreatedById", table: "TestRuns", type: "integer", nullable: true,
            oldClrType: typeof(int), oldType: "integer");
        migrationBuilder.AddForeignKey(
            name: "FK_TestRuns_Users_CreatedById", table: "TestRuns", column: "CreatedById",
            principalTable: "Users", principalColumn: "Id", onDelete: ReferentialAction.SetNull);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey("FK_TestRuns_Users_CreatedById", "TestRuns");
        migrationBuilder.AlterColumn<int>(
            name: "CreatedById", table: "TestRuns", type: "integer", nullable: false, defaultValue: 0,
            oldClrType: typeof(int), oldType: "integer", oldNullable: true);
        migrationBuilder.AddForeignKey(
            name: "FK_TestRuns_Users_CreatedById", table: "TestRuns", column: "CreatedById",
            principalTable: "Users", principalColumn: "Id", onDelete: ReferentialAction.Restrict);
    }
}
