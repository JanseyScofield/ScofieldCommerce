using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScofieldCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRegraComissaoId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RegraComissaoId",
                table: "Produtos");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte>(
                name: "RegraComissaoId",
                table: "Produtos",
                type: "smallint",
                nullable: false,
                defaultValue: (byte)0);
        }
    }
}
