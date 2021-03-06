import { Component, Injectable } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { ApiProvider, ChainNetwork } from '../../providers/api/api';
import { BlocksProvider } from '../../providers/blocks/blocks';
import { CurrencyProvider } from '../../providers/currency/currency';
import { Logger } from '../../providers/logger/logger';
import { PriceProvider } from '../../providers/price/price';

@Injectable()
@IonicPage({
  name: 'anchored-blocks',
  segment: ':chain/:network/anchored-blocks',
  defaultHistory: ['home']
})
@Component({
  selector: 'page-anchored-blocks',
  templateUrl: 'anchored-blocks.html'
})
export class AnchoredBlocksPage {
  public loading = true;
  public blocks;

  private chainNetwork: ChainNetwork;

  constructor(
    public navParams: NavParams,
    private apiProvider: ApiProvider,
    private blocksProvider: BlocksProvider,
    private logger: Logger,
    private currencyProvider: CurrencyProvider,
    private priceProvider: PriceProvider
  ) {
    const chain: string =
      navParams.get('chain') || this.apiProvider.getConfig().chain;
    const network: string =
      navParams.get('network') || this.apiProvider.getConfig().network;
    this.chainNetwork = {
      chain,
      network
    };

    this.apiProvider.changeNetwork(this.chainNetwork);
    this.currencyProvider.setCurrency();
    this.priceProvider.setCurrency();

    this.blocksProvider.getBlocks(10, true).subscribe(
      blocks => {
        this.blocks = blocks;
        this.loading = false;
      },
      err => {
        this.logger.error(err);
        this.loading = false;
      }
    );
  }
}
