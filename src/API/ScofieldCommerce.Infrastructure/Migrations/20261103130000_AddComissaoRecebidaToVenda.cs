using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScofieldCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddComissaoRecebidaToVenda : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ComissaoRecebida",
                table: "Vendas",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ComissaoRecebida",
                table: "Vendas");
        }
    }
}
