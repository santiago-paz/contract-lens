import type { ReactNode } from 'react';

import { plexSans, sourceSerif } from '@/components/landing/fonts';
import { Brand } from '@/components/landing/Logo';
import { ExpiringSample } from './ExpiringSample';

/*
 * The shell the sign-in and sign-up pages share.
 *
 * It is the share card's composition, made live: paper on the left carries the
 * mark, the headline and the form, and a navy block on the right carries the
 * landing's ground and one screen of the product. The paper side takes neither
 * light nor measure, because it is what a visitor reads and types on.
 *
 * On a phone the block drops below the form, the way the landing's sections
 * stack, so the first screen is the form and nothing else.
 *
 * `.landing` is the visual world's scope class (see app/globals.css), not a
 * claim about the route: it carries the tokens, the serif headline rule, the
 * fields and the pill buttons these pages share with the landing page.
 */
export function AuthShell({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`landing ${sourceSerif.variable} ${plexSans.variable} flex flex-col bg-paper text-ink selection:bg-mist lg:grid lg:grid-cols-12`}
    >
      <div className="flex min-h-[100svh] flex-col px-6 py-8 sm:px-10 sm:py-10 lg:col-span-7 lg:px-12">
        {/* The mark, the headline and the form share one left edge, and the
            column centres that group rather than pinning it to the gutter. */}
        <div className="mx-auto flex w-full max-w-[28rem] flex-1 flex-col">
          <Brand />

          <main className="flex flex-1 items-center py-12 lg:py-16">
            <div className="w-full">
              <h1 className="text-[2rem] leading-[1.1] sm:text-[2.375rem] lg:text-[2.625rem]">{title}</h1>
              {lead && <p className="mt-5 text-lead text-body">{lead}</p>}
              <div className="mt-9">{children}</div>
            </div>
          </main>
        </div>
      </div>

      {/* The block. `tone-navy` brings the landing's light and its measure. */}
      <aside className="tone-navy bg-navy lg:col-span-5">
        <div className="flex h-full items-center justify-center px-6 py-16 sm:px-10 lg:px-12">
          <ExpiringSample />
        </div>
      </aside>
    </div>
  );
}
