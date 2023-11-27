import { UnifiedWalletButton, UnifiedWalletProvider } from '@jup-ag/wallet-adapter';
import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import 'tailwindcss/tailwind.css';
import '../styles/globals.css';

import AppHeader from 'src/components/AppHeader/AppHeader';
import Footer from 'src/components/Footer/Footer';

import { SolflareWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import CodeBlocks from 'src/components/CodeBlocks/CodeBlocks';
import FormConfigurator from 'src/components/FormConfigurator';
import { IFormConfigurator, INITIAL_FORM_CONFIG, JUPITER_DEFAULT_RPC } from 'src/constants';
import IntegratedTerminal from 'src/content/IntegratedTerminal';
import ModalTerminal from 'src/content/ModalTerminal';
import WidgetTerminal from 'src/content/WidgetTerminal';
import { IInit } from 'src/types';
import V2SexyChameleonText from 'src/components/SexyChameleonText/V2SexyChameleonText';
import V2FeatureButton from 'src/components/V2FeatureButton';

const isDevNodeENV = process.env.NODE_ENV === 'development';
const isDeveloping = isDevNodeENV && typeof window !== 'undefined';
// In NextJS preview env settings
const isPreview = Boolean(process.env.NEXT_PUBLIC_IS_NEXT_PREVIEW);
if ((isDeveloping || isPreview) && typeof window !== 'undefined') {
  // Initialize an empty value, simulate webpack IIFE when imported
  (window as any).Jupiter = {};

  // Perform local fetch on development, and next preview
  Promise.all([import('../library'), import('../index')]).then((res) => {
    const [libraryProps, rendererProps] = res;

    (window as any).Jupiter = libraryProps;
    (window as any).JupiterRenderer = rendererProps;
  });
}

export default function App({ Component, pageProps }: AppProps) {
  const [tab, setTab] = useState<IInit['displayMode']>('integrated');

  // Cleanup on tab change
  useEffect(() => {
    if (window.Jupiter._instance) {
      window.Jupiter._instance = null;
    }
  }, [tab]);

  const rpcUrl = useMemo(() => JUPITER_DEFAULT_RPC, []);

  const { watch, reset, setValue, formState } = useForm<IFormConfigurator>({
    defaultValues: INITIAL_FORM_CONFIG,
  });

  const watchAllFields = watch();

  // Solflare wallet adapter comes with Metamask Snaps supports
  const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter(), new SolflareWalletAdapter()], []);

  const ShouldWrapWalletProvider = useMemo(() => {
    return watchAllFields.simulateWalletPassthrough
      ? ({ children }: { children: ReactNode }) => (
          <UnifiedWalletProvider
            wallets={wallets}
            config={{
              env: 'mainnet-beta',
              autoConnect: true,
              metadata: {
                name: 'Jupiter Terminal',
                description: '',
                url: 'https://terminal.jup.ag',
                iconUrls: [''],
              },
              theme: 'jupiter',
            }}
          >
            {children}
          </UnifiedWalletProvider>
        )
      : React.Fragment;
  }, [watchAllFields.simulateWalletPassthrough]);

  return (
    <>
      <DefaultSeo
        title={'Jupiter Terminal'}
        openGraph={{
          type: 'website',
          locale: 'en',
          title: 'Jupiter Terminal',
          description: 'Jupiter Terminal: An open-sourced, lite version of Jupiter that provides end-to-end swap flow.',
          url: 'https://terminal.jup.ag/',
          site_name: 'Jupiter Terminal',
          images: [
            {
              url: `https://og.jup.ag/api/jupiter`,
              alt: 'Jupiter Aggregator',
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: 'jup.ag',
          handle: '@JupiterExchange',
        }}
      />

      <div className="bg-v3-bg h-screen w-screen max-w-screen overflow-x-hidden flex flex-col justify-between">
        <div>
          <AppHeader />

          <div className="">

            <div className="flex justify-center">
              <div className="max-w-6xl bg-black/25 mt-12 rounded-xl flex flex-col md:flex-row w-full md:p-4 relative">

                <ShouldWrapWalletProvider>
                  <div className="mt-8 md:mt-0 md:ml-4 h-full w-full bg-black/40 rounded-xl flex flex-col">
                    {watchAllFields.simulateWalletPassthrough ? (
                      <div className="absolute right-6 top-8 text-white flex flex-col justify-center text-center">
                        <div className="text-xs mb-1">Simulate dApp Wallet</div>
                        <UnifiedWalletButton />
                      </div>
                    ) : null}

                    <div className="mt-4 flex justify-center ">
                      <button
                        onClick={() => {
                          setTab('modal');
                        }}
                        type="button"
                        className={classNames(
                          '!bg-none relative px-4 justify-center',
                          tab === 'modal' ? '' : 'opacity-20 hover:opacity-70',
                        )}
                      >
                        <div className="flex items-center text-md text-white">
                          {tab === 'modal' ? <V2SexyChameleonText>Modal</V2SexyChameleonText> : 'Modal'}
                        </div>

                        {tab === 'modal' ? (
                          <div className="absolute left-0 bottom-[-8px] w-full h-0.5 bg-gradient-to-r from-v3-primary to-[#00BEF0]" />
                        ) : (
                          <div className="absolute left-0 bottom-[-8px] w-full h-[1px] bg-white/50" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setTab('integrated');
                        }}
                        type="button"
                        className={classNames(
                          '!bg-none relative px-4 justify-center',
                          tab === 'integrated' ? '' : 'opacity-20 hover:opacity-70',
                        )}
                      >
                        <div className="flex items-center text-md text-white">
                          {tab === 'integrated' ? <V2SexyChameleonText>Integrated</V2SexyChameleonText> : 'Integrated'}
                        </div>
                        {tab === 'integrated' ? (
                          <div className="absolute left-0 bottom-[-8px] w-full h-0.5 bg-gradient-to-r from-v3-primary to-[#00BEF0]" />
                        ) : (
                          <div className="absolute left-0 bottom-[-8px] w-full h-[1px] bg-white/50" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setTab('widget');
                        }}
                        type="button"
                        className={classNames(
                          '!bg-none relative px-4 justify-center',
                          tab === 'widget' ? '' : 'opacity-20 hover:opacity-70',
                        )}
                      >
                        <div className="flex items-center text-md text-white">
                          {tab === 'widget' ? <V2SexyChameleonText>Widget</V2SexyChameleonText> : 'Widget'}
                        </div>

                        {tab === 'widget' ? (
                          <div className="absolute left-0 bottom-[-8px] w-full h-0.5 bg-gradient-to-r from-v3-primary to-[#00BEF0]" />
                        ) : (
                          <div className="absolute left-0 bottom-[-8px] w-full h-[1px] bg-white/50" />
                        )}
                      </button>
                    </div>

                    <span className="flex justify-center text-center text-xs text-[#9D9DA6] mt-4">
                      {tab === 'modal' ? '' : null}
                      {tab === 'integrated' ? '' : null}
                      {tab === 'widget'
                        ? ''
                        : null}
                    </span>

                    <div className="flex flex-grow items-center justify-center text-white/75">
                      {tab === 'modal' ? (
                        <ModalTerminal
                          rpcUrl={rpcUrl}
                          formProps={watchAllFields.formProps}
                          simulateWalletPassthrough={watchAllFields.simulateWalletPassthrough}
                          strictTokenList={watchAllFields.strictTokenList}
                          defaultExplorer={watchAllFields.defaultExplorer}
                        />
                      ) : null}
                      {tab === 'integrated' ? (
                        <IntegratedTerminal
                          rpcUrl={rpcUrl}
                          formProps={watchAllFields.formProps}
                          simulateWalletPassthrough={watchAllFields.simulateWalletPassthrough}
                          strictTokenList={watchAllFields.strictTokenList}
                          defaultExplorer={watchAllFields.defaultExplorer}
                        />
                      ) : null}
                      {tab === 'widget' ? (
                        <WidgetTerminal
                          rpcUrl={rpcUrl}
                          formProps={watchAllFields.formProps}
                          simulateWalletPassthrough={watchAllFields.simulateWalletPassthrough}
                          strictTokenList={watchAllFields.strictTokenList}
                          defaultExplorer={watchAllFields.defaultExplorer}
                        />
                      ) : null}
                    </div>
                  </div>
                </ShouldWrapWalletProvider>
              </div>
            </div>
            {/* Mobile configurator */}
            <div className="flex md:hidden">
              <FormConfigurator {...watchAllFields} reset={reset} setValue={setValue} formState={formState} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
