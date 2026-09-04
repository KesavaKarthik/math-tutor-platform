import uuid
from typing import List, Dict

import numexpr
import sympy as sp
import matplotlib.pyplot as plt
from pint import UnitRegistry

from langchain_core.tools import BaseTool

from core.config import settings

# Initialize unit registry for unit conversion
ureg = UnitRegistry()

class CalculatorTool(BaseTool):
    name: str = "calculator"
    description: str = "Safely evaluate a numeric expression and return the result. Use for arithmetic, powers, parentheses, etc."

    def _run(self, expression: str) -> str:
        try:
            result = numexpr.evaluate(expression).item()
            return str(result)
        except Exception as e:
            raise ValueError(f"Calculator error: {e}")

    def _arun(self, expression: str):
        raise NotImplementedError("Async calculator not supported")

class SymPyTool(BaseTool):
    name: str = "sympy"
    description: str = "Perform symbolic mathematics such as solve, simplify, integrate, factor. Provide a function name (solve/factor/etc.) and an expression.\n    Arguments:\n        action: one of 'solve', 'simplify', 'integrate', 'factor', 'expand'\n        expr: the sympy‑compatible expression string.\n        var (optional): variable for solve/integrate (default 'x')."

    def _run(self, action: str, expr: str, var: str = "x") -> str:
        try:
            sym_expr = sp.sympify(expr)
            symbol = sp.Symbol(var)
            if action == "solve":
                solutions = sp.solve(sym_expr, symbol)
                return sp.latex(solutions)
            elif action == "simplify":
                return sp.latex(sp.simplify(sym_expr))
            elif action == "integrate":
                integral = sp.integrate(sym_expr, symbol)
                return sp.latex(integral)
            elif action == "factor":
                return sp.latex(sp.factor(sym_expr))
            elif action == "expand":
                return sp.latex(sp.expand(sym_expr))
            else:
                raise ValueError(f"Unsupported sympy action: {action}")
        except Exception as e:
            raise ValueError(f"SymPy error: {e}")

    def _arun(self, *args, **kwargs):
        raise NotImplementedError("Async sympy not supported")

class PlotTool(BaseTool):
    name: str = "plot"
    description: str = "Generate a 2‑D plot from a Python expression of variable x. Return a file URL to the PNG image. Arguments: expr (e.g., 'sin(x)') and optional range (start, end)."

    def _run(self, expr: str, start: float = -10.0, end: float = 10.0, points: int = 400) -> str:
        try:
            x = sp.Symbol('x')
            func = sp.lambdify(x, sp.sympify(expr), "numpy")
            import numpy as np
            xs = np.linspace(start, end, points)
            ys = func(xs)
            plt.figure()
            plt.plot(xs, ys)
            plt.title(f"y = {expr}")
            plt.grid(True)
            plots_dir = settings.PLOT_OUTPUT_DIR / "plots"
            plots_dir.mkdir(parents=True, exist_ok=True)
            filename = f"plot_{uuid.uuid4().hex[:8]}.png"
            file_path = plots_dir / filename
            plt.savefig(str(file_path))
            plt.close()
            return f"file://{file_path.as_posix()}"
        except Exception as e:
            raise ValueError(f"Plot error: {e}")

    def _arun(self, *args, **kwargs):
        raise NotImplementedError("Async plot not supported")

class UnitConvertTool(BaseTool):
    name: str = "unit_convert"
    description: str = "Convert a quantity from one unit to another. Arguments: quantity (float), from_unit (str), to_unit (str)."

    def _run(self, quantity: float, from_unit: str, to_unit: str) -> str:
        try:
            qty = quantity * ureg(from_unit)
            result = qty.to(to_unit)
            return str(result)
        except Exception as e:
            raise ValueError(f"Unit conversion error: {e}")

    def _arun(self, *args, **kwargs):
        raise NotImplementedError("Async unit conversion not supported")

# Export ready‑to‑use instances
calculator_tool = CalculatorTool()
sympy_tool = SymPyTool()
plot_tool = PlotTool()
unit_convert_tool = UnitConvertTool()
