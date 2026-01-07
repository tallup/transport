<?php

namespace App\Exceptions;

use Exception;

class PricingNotFoundException extends Exception
{
    /**
     * Create a new exception instance.
     *
     * @param string $planType
     * @param int $code
     * @param \Throwable|null $previous
     */
    public function __construct(string $planType, int $code = 404, ?\Throwable $previous = null)
    {
        $message = "No pricing rule found for plan type: {$planType}";
        parent::__construct($message, $code, $previous);
    }

    /**
     * Render the exception as an HTTP response.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function render($request)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => $this->getMessage(),
                'error' => 'pricing_not_found',
            ], $this->getCode());
        }

        return redirect()->back()->withErrors(['plan_type' => $this->getMessage()]);
    }
}
