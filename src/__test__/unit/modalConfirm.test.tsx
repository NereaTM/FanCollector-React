import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalConfirm from "../../components/ui/ModalConfirm";

describe("ModalConfirm", () => {
  it("no renderiza nada cuando abierto es false", () => {
    const { container } = render(
      <ModalConfirm
        abierto={false}
        titulo="Título"
        onConfirmar={vi.fn()}
        onCancelar={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("muestra el título cuando está abierto", () => {
    render(
      <ModalConfirm
        abierto={true}
        titulo="¿Eliminar colección?"
        onConfirmar={vi.fn()}
        onCancelar={vi.fn()}
      />
    );
    expect(screen.getByText("¿Eliminar colección?")).toBeInTheDocument();
  });

  it("muestra el mensaje cuando se pasa", () => {
    render(
      <ModalConfirm
        abierto={true}
        titulo="Título"
        mensaje="Esta acción no se puede deshacer"
        onConfirmar={vi.fn()}
        onCancelar={vi.fn()}
      />
    );
    expect(screen.getByText("Esta acción no se puede deshacer")).toBeInTheDocument();
  });

  it("no muestra mensaje si no se pasa", () => {
    render(
      <ModalConfirm
        abierto={true}
        titulo="Título"
        onConfirmar={vi.fn()}
        onCancelar={vi.fn()}
      />
    );
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("muestra el label personalizado del botón de confirmación", () => {
    render(
      <ModalConfirm
        abierto={true}
        titulo="Título"
        labelConfirmar="Sí, eliminar"
        onConfirmar={vi.fn()}
        onCancelar={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Sí, eliminar" })).toBeInTheDocument();
  });

  it("llama a onConfirmar al pulsar el botón de confirmar", async () => {
    const onConfirmar = vi.fn();
    render(
      <ModalConfirm
        abierto={true}
        titulo="Título"
        onConfirmar={onConfirmar}
        onCancelar={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(onConfirmar).toHaveBeenCalledTimes(1);
  });

  it("llama a onCancelar al pulsar el botón de cancelar", async () => {
    const onCancelar = vi.fn();
    render(
      <ModalConfirm
        abierto={true}
        titulo="Título"
        onConfirmar={vi.fn()}
        onCancelar={onCancelar}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancelar).toHaveBeenCalledTimes(1);
  });

  it("llama a onCancelar al hacer click en el overlay", async () => {
    const onCancelar = vi.fn();
    render(
      <ModalConfirm
        abierto={true}
        titulo="Título"
        onConfirmar={vi.fn()}
        onCancelar={onCancelar}
      />
    );
    await userEvent.click(document.querySelector(".modal-overlay")!);
    expect(onCancelar).toHaveBeenCalledTimes(1);
  });
});