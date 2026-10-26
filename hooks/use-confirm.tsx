"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Options = { title: string; description?: string; confirmLabel?: string; destructive?: boolean };

/** Promise-based replacement for window.confirm: `if (!(await confirm({...}))) return;` and render `dialog`. */
export function useConfirm() {
  const [opts, setOpts] = useState<Options | null>(null);
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  const confirm = useCallback(
    (o: Options) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setOpts(o);
      }),
    [],
  );

  const settle = (ok: boolean) => {
    resolver.current?.(ok);
    resolver.current = null;
    setOpts(null);
  };

  const dialog = (
    <Dialog open={opts !== null} onOpenChange={(open) => !open && settle(false)}>
      <DialogContent className="w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{opts?.title}</DialogTitle>
          {opts?.description && <DialogDescription>{opts.description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => settle(false)}>
            Keep
          </Button>
          <Button variant={opts?.destructive === false ? "default" : "destructive"} onClick={() => settle(true)}>
            {opts?.confirmLabel ?? "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [confirm, dialog] as const;
}
